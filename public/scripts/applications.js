async function fetchAppliedJobs() {
    try {
        const response = await fetch(`/appliedJobs`);
        if (!response.ok) {
            throw new Error('Failed to fetch applied jobs');
        }
        const data = await response.json();
        console.log(data);

        const tableBody = document.querySelector('tbody');

        tableBody.innerHTML = '';

        data.appliedJobs.forEach((job, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${job.title}</td>
                <td class="px-6 py-4 whitespace-nowrap">${job.company}</td>
                <td class="px-6 py-4 whitespace-nowrap">${job.location}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span id="statusSpan${index}" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}">${job.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                    <div class="relative inline-block text-left">
                        <button id="editButton${index}" class="editButton bg-gray-200 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" data-absoluteurl="${job.absoluteUrl}">Edit</button>
                        <div id="dropdownMenu${index}" class="dropdown-menu hidden absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none">
                            <button class="dropdown-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-status="Applied">Applied</button>
                            <button class="dropdown-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-status="Interviewing">Interviewing</button>
                            <button class="dropdown-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-status="Offer">Offer</button>
                            <button class="dropdown-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" data-status="Rejected">Rejected</button>
                        </div>
                    </div>
                    <button class="deleteButton bg-gray-200 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" data-absoluteurl="${job.absoluteUrl}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            const deleteButton = row.querySelector(`.deleteButton`);
            deleteButton.addEventListener('click', (event) => {
                const absoluteUrl = event.currentTarget.dataset.absoluteurl;
                if (absoluteUrl) {
                    deleteRowAndFetch(absoluteUrl);
                } else {
                    console.error('Absolute URL not found for deletion');
                }
            });

            const editButton = row.querySelector(`#editButton${index}`);
            editButton.addEventListener('click', (event) => toggleDropdownMenu(event, index, job.absoluteUrl, data.appliedJobs.length));
        });
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        return [];
    }
}

async function deleteRowAndFetch(absoluteUrl) {
    try {
        const data = { url: absoluteUrl };

        // Send a POST request to the server to delete the job with the provided absolute URL
        const response =  await fetch('/deleteJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert data to JSON format
        });

        if (!response.ok) {
            throw new Error('Failed to delete job');
        }

        setTimeout(async () => {
            await fetchAppliedJobs();
        }, 200);
    } catch (error) {
        console.error('Error deleting job:', error);
    }
}


// Function to toggle dropdown menu visibility
function toggleDropdownMenu(event, index, absoluteUrl, totalJobs) {
    const dropdownMenu = document.getElementById(`dropdownMenu${index}`);
    dropdownMenu.classList.toggle('hidden');

    // Adjust dropdown menu position
    const windowHeight = window.innerHeight;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const dropdownMenuHeight = dropdownMenu.clientHeight;
    const bottomSpace = windowHeight - buttonRect.bottom;

    if (index >= totalJobs - 2) {
        dropdownMenu.style.top = 'auto';
        dropdownMenu.style.bottom = 'calc(100% + 10px)';
    } else {
        dropdownMenu.style.top = 'calc(100% + 10px)';
        dropdownMenu.style.bottom = 'auto';
    }

    // Update status when an option is selected
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item) => {
        item.addEventListener('click', () => {
            const newStatus = item.getAttribute('data-status');
            updateStatus(newStatus, absoluteUrl, index);
            dropdownMenu.classList.add('hidden');
        });
    });
}

async function updateStatus(newStatus, absoluteUrl, index) {
    try {
        const data = { url: absoluteUrl, status: newStatus };
        console.log(data);
        const response = await fetch(`/updateStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to update job status');
        }

        // Update the status locally
        const statusSpan = document.getElementById(`statusSpan${index}`);
        statusSpan.textContent = newStatus;
        statusSpan.className = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(newStatus)}`;
    } catch (error) {
        console.error('Error updating job status:', error);
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'Applied':
            return 'bg-green-100 text-green-800';
        case 'Interviewing':
            return 'bg-yellow-100 text-yellow-800';
        case 'Offer':
            return 'bg-blue-100 text-blue-800';
        case 'Rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

fetchAppliedJobs();


const backToSearch = document.getElementById('backToSearch');

backToSearch.addEventListener('click', () => {
  window.location.href = 'search.html';
});