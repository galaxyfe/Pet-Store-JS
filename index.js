const fs = require('fs/promises');
const fetch = require('node-fetch');

const [pathToFile, shouldUpdate] = process.argv.slice(2);

const petApiURL = 'https://petstore.swagger.io/v2/pet';

// Stretch One
// (DONE) Need to read a file with a pet
// (DONE) Parse the JSON into an object
// POST that object to the api

// Stretch Two
// Need to read a file with a pet
// Parse the JSON into an object
// PUT that object to the api changing it's status to pending

// GET - give me data
// POST - store this data
// PUT - change this data


function readJSONFile(fileName) {
  return fs.readFile(fileName, 'utf-8')
    .then(function (contents) {
        return JSON.parse(contents);
    });
}

function createNewPet(pet) {
  return fetch(petApiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pet)
  })
    .then(response => response.json());
}

function findPetsByStatus(status) {
  const url = `${petApiURL}/findByStatus?status=${status}`;

  return fetch(url)
    .then(response => response.json());
}

function getPetNames(pets) {
  return pets.map(function (pet, index) {
    return `${index + 1}: ${pet.name}`;
  });
}

function writePetsToFile(petNames, fileName) {
  const text = petNames.join('\n');

  return fs.writeFile(fileName, text);
}

/**
 * Main
 */

if (pathToFile && shouldUpdate) {
  console.log('You want to update a pet at that file');
} else if (pathToFile) {
  readJSONFile(pathToFile)
    .then(pet => createNewPet(pet))
    .then(console.log);
} else {
  findPetsByStatus('available')
    .then(pets => getPetNames(pets))
    .then(petNames =>
      writePetsToFile(petNames, 'available-pets.txt'));

  findPetsByStatus('pending')
      .then(pets => getPetNames(pets))
      .then(petNames =>
        writePetsToFile(petNames, 'pending-pets.txt'));
}
