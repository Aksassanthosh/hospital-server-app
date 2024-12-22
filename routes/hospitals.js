const express = require('express');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../hospitals.json');

const router = express.Router();


const readData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            try {
                resolve(JSON.parse(data || '[]'));
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};


const writeData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
};


router.get('/', async (req, res) => {
    try {
        const hospitals = await readData();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data' });
    }
});


router.post('/', async (req, res) => {
    const { name, patientCount, location } = req.body;

    if (!name || !patientCount || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hospitals = await readData();
        const newHospital = { id: Date.now(), name, patientCount, location };
        hospitals.push(newHospital);
        await writeData(hospitals);
        res.status(201).json(newHospital);
    } catch (error) {
        res.status(500).json({ message: 'Error saving data' });
    }
});


router.put('/:id', async (req, res) => {
    const hospitalId = parseInt(req.params.id);
    const { name, patientCount, location } = req.body;

    if (!name || !patientCount || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hospitals = await readData();
        const index = hospitals.findIndex(hospital => hospital.id === hospitalId);

        if (index === -1) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const updatedHospital = { ...hospitals[index], name, patientCount, location };
        hospitals[index] = updatedHospital;
        await writeData(hospitals);

        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(500).json({ message: 'Error updating data' });
    }
});


router.delete('/:id', async (req, res) => {
    const hospitalId = parseInt(req.params.id);

    try {
        const hospitals = await readData();
        const filteredHospitals = hospitals.filter(hospital => hospital.id !== hospitalId);

        if (hospitals.length === filteredHospitals.length) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        await writeData(filteredHospitals);
        res.status(200).json({ message: 'Hospital deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data' });
    }
});

module.exports = router;
