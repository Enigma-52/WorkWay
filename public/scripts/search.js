
async function companies() {
    await fetch('/companies')
      .then(response => response.json())
      .then(companies => {
        const companyDropdown = document.getElementById('companyDropdown');
        companies.forEach(company => {
          const option = document.createElement('option');
          option.value = company;
          option.textContent = company;
          companyDropdown.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching company data:', error));
}

companies();

var userSubscribed;

async function fetchUserSubscribedData() {
  try {
    const response = await fetch('/userSubscribed');
    if (!response.ok) {
      throw new Error('Failed to fetch user subscribed data');
    }
    const data = await response.json();
    userSubscribed = data.subscribed;
  } catch (error) {
    console.error('Error fetching user subscribed data:', error);
    return null;
  }
}
fetchUserSubscribedData();

let job;
let company;
let job_location;
function fetchJobs(jobTitle = '', selectedCompany = '',jobLocation = '') {
  job=jobTitle;
  company=selectedCompany;
  job_location=jobLocation;
fetch(`/jobs?job=${jobTitle}&company=${selectedCompany}&location=${jobLocation}`)
.then(response => response.json())
.then(jobs => {
  const jobList = document.getElementById('jobList');
  const noJobsMessage = document.getElementById('noJobsMessage');
  const jobCountMessage = document.getElementById('jobCountMessage');
  jobList.innerHTML = '';

  if (jobs.length === 0) {
    noJobsMessage.style.display = 'block';
    jobCountMessage.textContent = '';
    const payForMoreButton = document.getElementById('pay-button');
    payForMoreButton.style.display = 'none';
    const subheading = document.getElementById('pay-subheading');
    subheading.style.display = 'none';
  }
  else if(jobs.length > 10 && userSubscribed==false) {
    noJobsMessage.style.display = 'none';
    jobCountMessage.textContent = `Number of jobs found: ${jobs.length}`;
    
        jobs.slice(0, 10).forEach(job => {
            const card = document.createElement('div');
            card.classList.add('job-card');
            card.innerHTML = `
                <h2>${job.title}</h2>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Company:</strong> ${job.company}</p>
                <a href="${job.absoluteUrl}" class="view-details-link" target="_blank">View Details</a>
            `;
            jobList.appendChild(card);
            const viewDetailsLink = card.querySelector('.view-details-link');
            viewDetailsLink.addEventListener('click', (event) => {
              // Remove the "View Details" link
              viewDetailsLink.remove();

              // Add the "Applied?" text
              const appliedText = document.createElement('p');
              appliedText.textContent = 'Applied?';
              appliedText.classList.add('mt-4'); // Add margin top
              card.appendChild(appliedText);

              // Add the "Applied" button
              const appliedButton = document.createElement('button');
              appliedButton.textContent = 'Applied';
              appliedButton.classList.add('mt-2', 'px-4', 'py-2', 'bg-green-500', 'text-white', 'rounded', 'hover:bg-green-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-600', 'focus:ring-opacity-50');
              appliedButton.addEventListener('click', () => {
                  const url = viewDetailsLink.href;
                  addToApplications(url);
                  const card = appliedButton.closest('.job-card');
                  card.remove();
              });
              card.appendChild(appliedButton);

              // Add the "Skipped" button
              const skippedButton = document.createElement('button');
              skippedButton.textContent = 'Skipped';
              skippedButton.classList.add('mt-2', 'ml-2', 'px-4', 'py-2', 'bg-red-500', 'text-white', 'rounded', 'hover:bg-red-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-600', 'focus:ring-opacity-50');
              skippedButton.addEventListener('click', () => {
                appliedText.remove();
                appliedButton.remove();
                skippedButton.remove();

                // Re-add the "View Details" link
                card.appendChild(viewDetailsLink);
              });
              card.appendChild(skippedButton);
            });
        });

        // Get the pay button element
        const payForMoreButton = document.getElementById('pay-button');
        payForMoreButton.style.display = 'block';
        
        // Update button text and add class
        payForMoreButton.textContent = 'Access more Jobs';
        payForMoreButton.classList.add('pay-button');

        // Create a subheading element
        const subheading = document.getElementById('pay-subheading');
        subheading.style.display = 'block';
        subheading.textContent = 'Get access to more job opportunities for a small fee of ₹5';
        subheading.classList.add('subheading'); // Add a class for styling        
    
} else {
    const payForMoreButton = document.getElementById('pay-button');
    payForMoreButton.style.display = 'none';
    const subheading = document.getElementById('pay-subheading');
    subheading.style.display = 'none';
    noJobsMessage.style.display = 'none';
    jobCountMessage.textContent = `Number of jobs found: ${jobs.length}`;
    jobs.forEach(job => {
      const card = document.createElement('div');
      card.classList.add('job-card');
      card.innerHTML = `
        <h2>${job.title}</h2>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Company:</strong> ${job.company}</p>
        <a href="${job.absoluteUrl}" class="view-details-link" target="_blank">View Details</a>
      `;
      jobList.appendChild(card);
      const viewDetailsLink = card.querySelector('.view-details-link');
            viewDetailsLink.addEventListener('click', (event) => {
              // Remove the "View Details" link
              viewDetailsLink.remove();

              // Add the "Applied?" text
              const appliedText = document.createElement('p');
              appliedText.classList.add('mt-4'); // Add margin top
              appliedText.textContent = 'Applied?';
              card.appendChild(appliedText);

              // Add the "Applied" button
              const appliedButton = document.createElement('button');
              appliedButton.textContent = 'Applied';
              appliedButton.classList.add('mt-2', 'px-4', 'py-2', 'bg-green-500', 'text-white', 'rounded', 'hover:bg-green-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-600', 'focus:ring-opacity-50');
              appliedButton.addEventListener('click', () => {
                const url = viewDetailsLink.href;
                addToApplications(url);
                const card = appliedButton.closest('.job-card');
                card.remove(); 
              });
              card.appendChild(appliedButton);

              // Add the "Skipped" button
              const skippedButton = document.createElement('button');
              skippedButton.textContent = 'Skipped';
              skippedButton.classList.add('mt-2', 'ml-2', 'px-4', 'py-2', 'bg-red-500', 'text-white', 'rounded', 'hover:bg-red-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-600', 'focus:ring-opacity-50');
              skippedButton.addEventListener('click', () => {
                appliedText.remove();
                appliedButton.remove();
                skippedButton.remove();

                // Re-add the "View Details" link
                card.appendChild(viewDetailsLink);
              });
              card.appendChild(skippedButton);
            });
    });
  }
})
.catch(error => console.error('Error fetching job data:', error));
}

function addToApplications(url) {
  // Data to send in the POST request
  const data = { url: url };

  // POST request options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  // URL for the POST request
  const postURL = '/applications';

  // Send the POST request
  fetch(postURL, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add application');
      }
      console.log('Application added successfully');
      // You can handle success as needed
    })
    .catch(error => {
      console.error('Error adding application:', error);
      // You can handle errors as needed
    });
}

document.getElementById('searchButton').addEventListener('click', () => {
  const jobTitle = document.getElementById('jobTitle').value.trim();
  const jobLocation = document.getElementById('jobLocation').value.trim();
  const selectedCompany = document.getElementById('companyDropdown').value.trim();
  fetchJobs(jobTitle, selectedCompany,jobLocation);
});


document.getElementById('pay-button').addEventListener('click', async function(event) {

    const amount = 5;
    const currency = 'INR';
    const receipt = 'Job Board';

    try {
        const response = await fetch('/createPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, currency, receipt })
        });

        const data = await response.json();
        const orderId = data.orderId;
        const orderAmount = data.amount;

        // Initialize Razorpay
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: orderAmount,
            currency: currency,

            name: 'Job Board',
            checkout: {
              name: "Job Board"
            },
            description: 'Job Access Fee',
            order_id: orderId,
            handler: async function(response) {
                try {
                    const paymentId = response.razorpay_payment_id;
                    const signature = response.razorpay_signature;

                    const successResponse = await fetch('/paymentSuccess', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ orderId, paymentId, signature })
                    });
                      const successMessage = await successResponse.text();
                      console.log(successMessage);

                      userSubscribed = true;

                      fetchJobs(job, company,job_location);
                } catch (error) {
                    console.error('Error processing payment:', error);
                    alert('Payment failed');
                }
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Error creating payment:', error);
        alert('Error creating payment');
    }
    
});


const viewApplicationsButton = document.getElementById('viewApplicationsButton');

// Add click event listener
viewApplicationsButton.addEventListener('click', () => {
  // Redirect to applications.html
  window.location.href = 'applications.html';
});