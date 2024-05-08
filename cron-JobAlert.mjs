import pkg from './firebaseConfig.mjs';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;
import nodemailer from 'nodemailer';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 8000;

let storedJobs; 

const jobs = [];
let filteredJobs = [];
async function fetchAndFilterJobs(jobTitleFilter,companyFilter,locationFilter) {
    try {
      const jobsCollection = collection(db, 'jobs');
      const snapshot = await getDocs(jobsCollection);
      filteredJobs=[];
      snapshot.forEach(doc => {
        const company = doc.id;
        const jobData = doc.data().data.jobs;
  
        jobData.forEach(job => {
            const jobInfo = {
                title: job.title,
                location: job.location.name,
                company,
                absoluteUrl: job.absolute_url
              };

            const passesCompanyFilter = !companyFilter || jobInfo.company.toLowerCase().includes(companyFilter.toLowerCase());
            const passesLocationFilter = !locationFilter || jobInfo.location.toLowerCase().includes(locationFilter.toLowerCase());
            const passesJobTitleFilter = !jobTitleFilter || jobInfo.title.toLowerCase().includes(jobTitleFilter.toLowerCase());

            if (passesCompanyFilter && passesLocationFilter && passesJobTitleFilter && filteredJobs.length < 5) {
                filteredJobs.push(jobInfo);
            }
        });
      });
      return filteredJobs;
    } catch (error) {
      console.error('Error adding jobs:', error);
    }
  }
  
  function generateJobHTML(job) {
    return `
      <div class="job-listing">
        <h2 class="job-title">${job.title}</h2>
        <p class="job-info"><strong>Location:</strong> ${job.location}</p>
        <p class="job-info"><strong>Company:</strong> ${job.company}</p>
        <a href="${job.absoluteUrl}" class="job-link">View Job</a>
      </div>
    `;
  }

function htmlContentGenerator(jobListingsHTML) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Listings</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
    
            h1 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
    
            .job-listing {
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
                margin-bottom: 20px;
            }
    
            .job-title {
                font-size: 20px;
                color: #007bff;
                margin-top: 0;
                margin-bottom: 10px;
            }
    
            .job-info {
                font-size: 16px;
                margin-bottom: 8px;
            }
    
            .job-link {
                display: inline-block;
                text-decoration: none;
                color: #007bff;
                font-weight: bold;
                background-color: #FFFFFF;
                color: white;
                padding: 8px 16px;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
    
            .job-link:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    
    <body>
        <h1>Job Listings</h1>
        ${jobListingsHTML}
    </body>
    
    </html>
    `;

    return htmlContent;
}

async function processJobAlerts() {
    try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);

        // Iterate over each user document
        querySnapshot.forEach(async (userDoc) => {
            const userData = userDoc.data();
            const userId = userDoc.id;
            
            // Check if the user has a jobAlerts array
            if (userData.hasOwnProperty('jobAlerts')) {

                console.log(userData.email);
                const jobAlerts = userData.jobAlerts;
                
                console.log(jobAlerts);
                for (const jobAlert of jobAlerts) {
                    try {
                        const jobs = await fetchAndFilterJobs(jobAlert.jobTitle, jobAlert.company, jobAlert.location);
                        console.log(jobs);
        
                        // Constructing the HTML content
                        const jobListingsHTML = jobs.map(job => generateJobHTML(job)).join('');
                        
                        // Complete HTML content
                        const htmlContent = htmlContentGenerator(jobListingsHTML);
        
                        const email = userDoc.data().email;
                        const subject = 'Your Job Alerts are here!';
                        const content = htmlContent;
                        sendEmail(email, subject, content);
                    } catch (error) {
                        console.error('Error processing job alerts:', error);
                    }
                }
            }
        });

        console.log('Job alerts processing complete.');
    } catch (error) {
        console.error('Error processing job alerts:', error);
    }
}

processJobAlerts();


async function sendEmail(email, subject, content) {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'rohit.singh.33521@gmail.com',
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'Rohit Singh <rohit.singh.33521@gmail.com>',
        to: email,
        subject: subject,
        html: content 
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});