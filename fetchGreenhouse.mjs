import pkg from './firebaseConfig.mjs';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;

import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const port = 8000;

const companies = [
    "Apptronik",
    "GoMotive",
    "ExnessInternship",
    "NoahMedical",
    "HarbingerMotors",
    "Niantic",
    "RecordedFuture",
    "Verkada",
    "Sertis",
    "Udemybedi",
    "Minitab",
    "Verily",
    "Radiant",
    "CapellaSpace",
    "DoubleVerify",
    "Gusto",
    "Astranis",
    "JaneStreet",
    "Make",
    "RocketLab",
    "ZipRecruiter",
    "ToyotaConnected",
    "Dataiku",
    "WeHRTYou",
    "Censys",
    "OwnBackup",
    "RTI",
    "Talos",
    "Gardacp",
    "Mill",
    "Skyryse",
    "OneDegree",
    "FlyZipline",
    "GeckoRobotics",
    "Duolingo",
    "GiveDirectly",
    "CleoIndia",
    "Remotasks",
    "AptosLabs",
    "HighMetric",
    "Thoughtspot",
    "WorldCoinOrg",
    "Catchpoint",
    "Airbase",
    "GoDaddy",
    "Acumen",
    "FreshPrints",
    "RockstarGames",
    "PorchIndia",
    "ChargePoint",
    "EasyShip",
    "Datadog",
    "JFrog",
    "ArkoseLabsIndia",
    "WizeHiveIndia",
    "MHI",
    "Ivalua",
    "Dimagi",
    "SnowflakeComputing",
    "Qualtrics",
    "Wileyedge",
    "Gleanwork",
    "Highmetric",
    "Toast",
    "Aspireio",
    "Databook",
    "Canonical",
    "StorableIndia",
    "Legion",
    "Skyflow",
    "Alphasense",
    "Degreed",
    "Fortra",
    "Addepar1",
    "BlinkHealth",
    "Upkeep",
    "DiligentCorporation",
    "Acquia",
    "Mixpanel",
    "BrightInsight",
    "Startree",
    "Ivalua",
    "Vimeo",
    "Syndigo",
    "PorchIndia",
    "Opendoor",
    "Moveworks",
    "ArcadiaCareers",
    "CleoIndia",
    "Intgrate",
    "Phonepe",
    "FiveTran",
    "Stripe",
    "Disco",
    "Instawork",
    "BerkadiaIndia",
    "Oportun",
    "ApolloIO",
    "SingleStore",
    "Decisions",
    "EpisodeSIX",
    "CourseHero",
    "EnvoyGlobalINC",
    "Bloomreach",
    "BusinessolverGhost",
    "Verifone",
    "Lacework",
    "Talos",
    "NoahMedical",
    "TraceLinkInc",
    "Poshmark",
    "Rubrik",
    "Addepar1",
    "Encora10",
    "Agoda",
    "RSIinternBoard",
    "Ivalua",
    "GroundTruth",
    "Moveworks",
    "AbnormalSecurity",
    "GravitonResearchCapital",
    "Enterpret",
    "OwnBackup",
    "IBKR",
    "SingleStore",
    "Fivetran",
    "Crunchyroll",
    "Devrev",
    "Benchling",
    "Mixpanel",
    "Digicert",
    "Mindbody",
    "Brex",
    "Lacework",
    "Samsara",
    "Enfusion",
    "Seekout",
    "Make",
    "Sumologic",
    "Circle",
    "Verifone",
    "ClarifAI",
    "Talos",
    "FuboTV",
    "Litmus46",
    "Acorns",
    "Databento",
    "CoinBase",
    "Moloco",
    "IMC",
    "Neuralink",
    "Relativity",
    "Affinitiv",
    "Enova",
    "SigmaComputing",
    "Docugami",
    "Tesseract",
    "Intradiem",
    "Verkada",
    "AptosLabs",
    "Reltio",
    "Applovin",
    "Skydio",
    "Schonfeld",
    "HyanniSportsResearch",
    "Loop",
    "Chime",
    "Gardacp",
    "Futronics",
    "Inbank",
    "Metron",
    "Alarmcom",
    "Dropbox",
     "Twilio", 
    "Brevium","OpenSesame","AscendAnalytics" ,"MongoDB", "PagerDuty", "Elastic", "Anaplan", "Databricks", "GitLab", "HashiCorp", "Okta", "Zscaler", "Datadog", "Dropbox", "Tanium", "Zuora", "ZoomInfo", "NICE", "SolarWinds", "InterSystems", "Appian", "SolarWinds", "Appian", "SolarWinds", "SolarWinds", "SolarWinds", "Appian", "SolarWinds", "SolarWinds", "SolarWinds", "SolarWinds", "Dropbox", "Tanium", "Zuora", "ZoomInfo", "NICE", "SolarWinds", "InterSystems", "Udemy", "Pinterest", "Twitch", "Squarespace", "Asana", "Stripe", "Dropbox", "Instacart", "Okta", "Thumbtack", "Zapier", "HashiCorp", "PagerDuty", "Gusto", "Twilio", "SurveyMonkey", "Glassdoor", "DoorDash", "Flexport", "Figma", "Gusto", "Guru", "Handshake", "HackerRank", "HashiCorp", "Hootsuite", "HubSpot", "Indeed", "Instacart", "Integrate", "Jampp", "Jumia", "Justworks", "Lattice", "Life360", "LinkedIn", "Lyft", "Marqeta", "Mindbody", "Mixpanel", "MongoDB", "Mozilla", "MyHeritage", "N26", "Narvar", "Netskope", "Netlify", "Nextdoor", "OANDA", "Oath", "Okta", "OpenTable", "Opendoor", "OpenTable", "PagerDuty", "PathAI", "PebblePost", "Peloton", "Pendo", "Pinterest", "Qualtrics", "Quip", "Reddit", "Reddit", "Relativity", "Rev", "Roblox", "Roku", "Rubrik", "Samsara", "SeatGeek", "Sisense", "Skydio", "SkyScanner", "Smartsheet", "SoFi", "Solera", "SpaceX", "Squarespace", "Squarespace", "Strava", "Stripe", "SurveyMonkey", "Symphony", "Synack", "Sysdig", "Tanium", "Thumbtack", "Toast", "TripAdvisor", "Twitch", "Twilio", "Udacity", "Udemy", "Upstart", "Upwork", "Vimeo", "Wayfair", "Weave", "Webflow", "Wework", "WillowTree", "Wizeline", "Yext", "Yummly", "Zapier", "Zenefits", "ZoomInfo", "Zscaler", "Zuora", "Zynga"
];

//https://www.google.com/search?q=site%3Agreenhouse.io+software+engineer+intern&sca_esv=177e7810b56377bb&sca_upv=1&sxsrf=ACQVn0_p-IeLSXMfkyD6iTv2s4uv7Tr5UA%3A1711815122325&ei=0jkIZsm_E-6B1e8PqN2OyAM&ved=0ahUKEwjJ8KWisJyFAxXuQPUHHaiuAzkQ4dUDCBA&uact=5&oq=site%3Agreenhouse.io+software+engineer+intern&gs_lp=Egxnd3Mtd2l6LXNlcnAiK3NpdGU6Z3JlZW5ob3VzZS5pbyBzb2Z0d2FyZSBlbmdpbmVlciBpbnRlcm5IrFJQVlimUXAFeACQAQCYAcwCoAGtHaoBCDAuMjMuMC4xuAEDyAEA-AEBmAIAoAIAmAMAiAYBkgcAoAe4CA&sclient=gws-wiz-serp#ip=1

const baseUrl = "https://boards-api.greenhouse.io/v1/boards/";

function generateJobBoardURLs(companies) {
    return companies.map(company => `${baseUrl}${company.toLowerCase()}/jobs`);
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        return null;
    }
    return response.json();
}

async function fetchAllData(urls) {
    const allData = [];
    for (const url of urls) {
        try {
            const data = await fetchData(url);
            allData.push(data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
            allData.push(null); 
        }
    }
    return allData;
}

async function saveDataToFirestore() {
    try {
        
        const jobBoardURLs = generateJobBoardURLs(companies);

        // Fetch data from all URLs
        const allData = await fetchAllData(jobBoardURLs);

        // Store all the fetched data in Firestore
        for (let i = 0; i < companies.length; i++) {
            const companyName = companies[i];
            const companyData = allData[i];

            if (companyData !== null) {
                const docRef = doc(db, 'jobs', companyName);
                const details = {
                    data: companyData
                };
                await setDoc(docRef, details, {
                    merge: true
                });
                console.log(`Data for ${companyName} saved to Firestore successfully`);
            }
        }

        console.log('All data saved to Firestore successfully');
    } catch (error) {
        console.error('Error saving data to Firestore:', error);
    }
}

saveDataToFirestore();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/jobs', async (req, res) => {
    try {
        let totalJobs = 0;

        // Reference to the 'jobs' collection
        const jobsCollection = collection(db, 'jobs');

        // Get all documents from the 'jobs' collection
        const querySnapshot = await getDocs(jobsCollection);

        // Iterate over each document
        querySnapshot.forEach(doc => {
            // Get the data from the document
            const jobData = doc.data();

            // Access the 'meta' field in the document to get total jobs
            const total = jobData.data.meta.total;

            // Accumulate totalJobs count
            totalJobs += total;

            // Process the data as needed
            console.log(`Total jobs for ${doc.id}: ${total}`);
        });

        // Log the total jobs count for all documents
        console.log(`Total jobs in all documents: ${totalJobs}`);

        res.json({
            totalJobs
        });
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).json({
            error: 'Failed to fetch data from Firestore'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});