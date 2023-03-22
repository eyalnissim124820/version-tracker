const router = require('express').Router();
require("dotenv").config();
const { gitlogPromise } = require("gitlog");
const path = require('path')
const axios = require('axios')
const atob = require('atob')
const fs = require('fs');

// get commits and repo data

const repoPath = path.resolve(__dirname, '../../my-portfolio')

const options = {
    repo: repoPath,
    number: 20,
    author: "eyalnissim124820",
    fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel", "authorDate"],
    execOptions: { maxBuffer: 1000 * 1024 },
};

router.get('/', (req, res) => {
    gitlogPromise(options)
        .then((commits) => res.send(commits))
        .catch((err) => console.log(err));
})




// access package.json from git
console.log(process.env.GIT_TOKEN);

router.get('/json', async (req, res) => {
    const owner = 'eyalnissim124820';
    const repo = 'pet_adoption_fe';
    const path = 'package.json';
    try {
        console.log('Fetching from git repo');
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${process.env.GIT_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        })
        const decoded = atob(response.data.content)
        const responseObject = JSON.parse(decoded);
        const dependencies = responseObject.dependencies;
        for (const dependency in dependencies) {
            console.log(`lib: ${dependency} ---> version: ${dependencies[dependency]}`);
        }
        // create new package.json file
        fs.open('package2.json', 'w', parseInt('0666', 8), function (err, file) {
            if (err) throw err;
            console.log('New package.json created');
            fs.write(file, decoded, (err) => {
                if (err) throw err;
                console.log('Content written to file');
                fs.close(file, (err) => {
                    if (err) throw err;
                    console.log('File closed');
                })
            })
        });
        res.send(dependencies)
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;