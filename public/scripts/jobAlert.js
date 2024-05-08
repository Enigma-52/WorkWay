document.getElementById('frequency').addEventListener('change', function() {
  var specificDayInput = document.getElementById('specificDay');
  if (this.value === 'Specific Day') {
      specificDayInput.classList.remove('hidden');
      specificDayInput.setAttribute('required', 'true');
  } else {
      specificDayInput.classList.add('hidden');
      specificDayInput.removeAttribute('required');
  }
});


getJobs();

function getJobs() {
    fetch('/jobAlerts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch job alerts');
            }
            return response.json();
        })
        .then(jobAlerts => {
            document.getElementById('alertList').innerHTML = '';
            addToView(jobAlerts);
        })
        .catch(error => {
            console.error('Error fetching job alerts:', error);
        });
}

// Assuming this code is inside a function that adds job alerts to the view
function addToView(jobAlerts) {
    console.log(jobAlerts);

    jobAlerts.forEach((alert,index) => {
        const { jobTitle, company, location, frequency, specificDay } = alert;

        var alertListItem = document.createElement('div');
        alertListItem.dataset.index = index;
        alertListItem.classList.add('job-alert');
        alertListItem.classList.add('flex', 'justify-between', 'items-center', 'p-4', 'bg-white', 'rounded-lg', 'shadow');
        alertListItem.innerHTML = `
            <div>
                <p class="text-lg font-semibold text-gray-800">${jobTitle} at ${company}</p>
                <p class="text-gray-600">${location} - ${frequency}${frequency === 'Specific Day' ? ' (' + specificDay + ')' : ''}</p>
            </div>
            <button class="deleteAlertBtn text-red-500 hover:text-red-700 transition-colors duration-200">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        document.getElementById('alertList').appendChild(alertListItem);
    });
    initializePage();
}

document.getElementById('addAlertBtn').addEventListener('click', function() {
  var jobTitle = document.getElementById('jobTitle').value;
  var location = document.getElementById('location').value.trim();
  var company = document.getElementById('company').value.trim();


  var frequency = document.getElementById('frequency').value;
  var specificDay = '';
  if (frequency === 'Specific Day') {
      specificDay = document.getElementById('specificDay').value.trim();
      if (!specificDay) {
          alert('Please enter a specific day');
          return;
      }
  }

  const data = {
    jobTitle: jobTitle,
    location: location,
    company: company,
    frequency: frequency,
    specificDay: specificDay
};

saveJobAlert(data);

async function saveJobAlert(data) {
    try {
        const response = await fetch('/saveJobAlert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to save job alert');
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error during fetch:', error.message);
    }
}

setTimeout(getJobs, 300);


  // Clear input fields
  document.getElementById('jobTitle').value = '';
  document.getElementById('location').value = '';
  document.getElementById('company').value = '';
  document.getElementById('specificDay').value = '';
});

const backToSearch = document.getElementById('backToSearch');

backToSearch.addEventListener('click', () => {
  window.location.href = 'search.html';
});


// Assuming this code is inside a function that initializes the page
function initializePage() {
    // Add event listener to delete buttons to handle delete functionality
    const deleteButtons = document.querySelectorAll('.deleteAlertBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const alertListItem = event.target.closest('.job-alert');
            if (!alertListItem) {
                console.error('Error: Unable to find the parent .job-alert element.');
                return;
            }
            const index = alertListItem.dataset.index; // Retrieve the index of the job alert
            if (!index) {
                console.error('Error: Unable to find the dataset index attribute.');
                return;
            }
            const confirmed = confirm('Are you sure you want to delete this job alert?');
            if (confirmed) {
                try {
                    // Send a request to the server to delete the job alert
                    const response = await fetch('/deleteJobAlert', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ index: index })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete job alert');
                    }
                    // Remove the job alert from the view
                    alertListItem.remove();

                    setTimeout(getJobs, 500);
                } catch (error) {
                    console.error('Error deleting job alert:', error);
                    alert('Failed to delete job alert');
                }
            }
        });
    });
}

setTimeout(initializePage,1000);
