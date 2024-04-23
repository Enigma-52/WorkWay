import pkg from './firebaseConfig.mjs';
const {
    db,
    doc,
    setDoc,
} = pkg;

import express from 'express';
import fetch from "node-fetch";

const companies = [
  "Rockset",
  "Replicant",
  "Papara",
  "Latch",
  "Dodmg",
  "Wisk",
  "Netflix",
  "Pennylane",
  "Lumosity",
  "Ritual",
  "Metabase",
  "WanDB",
  "Anybotics",
  "QBio",
  "TorchDental",
  "Cresta",
  "Whoop",
  "Klarna",
  "Weride",
  "SimplyWallst",
  "MatchGroup",
  "Replicant",
  "Alluxio",
  "OpenX",
  "Provi",
  "SandboxVR",
  "Alice-Bob",
  "EquipHealth",
  "Cohere",
  "Govini",
  "UseInsider",
  "CBTNuggets",
  "ScanlineVFX",
  "Cresta",
  "Trunkio",
  "Agtonomy",
  "Uncountable",
  "PayJoy",
  "Secureframe",
  "WorkOS",
  "Lime",
  "Monad",
  "Azul",
  "Klarna",
  "AngelList",
  "Voleon",
  "Wisk",
  "DAZN",
  "TryJeeves",
  "Kong",
  "Ontic",
  "Zeotap",
  "XAgroup",
  "Highspot",
  "Hevodata",
  "Actian",
  "Accurate",
  "Egen",
  "UEI",
  "R3.com",
  "RedaptiveINC",
  "TeikaMetrics",
  "Mashgin",
  "SigFig-2",
  "Dreamsports",
  "KokoNetworks",
  "CogitoCorp",
  "Findem",
  "TTecDigital",
  "Zededa",
  "TrustArc",
  "Mendix",
  "AlifSemi",
  "BrightEdge",
  "Brillio-2",
  "Immutable",
  "Tala",
  "Smarsh",
  "Fampay",
  "ParallelWireless",
  "Hotstar",
  "RivosINC",
  "BookeeApp",
  "Galatea-Associates",
  "Actian",
  "Plus-2",
  "Extremenetworks",
  "Mindtickle",
  "Hevodata",
  "Mactores",
  "Certik",
  "Veeva",
  "Augmedix",
  "Nominal",
  "Coupa",
  "Rocketlawyer",
  "AskFavor",
  "RackSpace",
  "Zuru",
  "Aircall",
  "GoodLeap",
  "Clari",
  "Nium",
  "Mendix",
  "Zippi",
  "Kodiak",
  "Dazn",
  "Fluence",
  "ShyftLabs",
  "Aeva",
  "PingCAP",
  "LevelAI",
  "LIFE",
  "Uniphore",
  "Quince",
  "Instructure",
  "Doola",
  "WeLocalize",
  "Attentive",
  "Hadrian",
  "GoForward",
  "Metabase",
  "Articulate",
  "Waabi",
  "Augmedix",
  "Framework",
  "Bukuwarung",
  "Entrata",
  "AeraTechnology",
  "Balbix",
  "Upstox",
  "DNB",
  "Plum",
  "Kong",
  "Palantir",
  "Nielsen"
];

async function fetchAllJobs() {
  const allJobs = [];

  for (const companyName of companies) {
      const apiUrl = `https://api.lever.co/v0/postings/${companyName.toLowerCase()}?mode=json`;

      try {
          const response = await fetch(apiUrl);
          const jobCompany = await response.json();
          
          
          const jobByCompany =[];
          
          for (const job of jobCompany) {
              const jobData = {
                  title: job.text,
                  location:{ 
                    name: job.categories.location
                  },
                  absolute_url: job.hostedUrl
              };
              jobByCompany.push(jobData);
          }
          const jobss ={
            jobs: jobByCompany
          }
          const docRef = doc(db, 'jobs', companyName);
          const details = {
            data: jobss
          };
          await setDoc(docRef, details, {
              merge: true
          });

          console.log("All Jobs for " + companyName + " fetched and added to DB Successfully");
          
      } catch (error) {
          console.error(`Error fetching jobs for ${companyName}:`, error);
      }
  }

  return allJobs;
}

async function main() {
  try {
    const jobs = await fetchAllJobs();
    console.log(JSON.stringify(jobs, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const app = express();
const port = 8001;

app.listen(port, () => {
  main();
});