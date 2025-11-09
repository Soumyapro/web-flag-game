import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { generateFlagQuestion } from '../controllers/flagController.js';

export const getFlagInformation = async (req, res) => {
    try {
        const info = await fetch('https://flagcdn.com/en/codes.json');
        const api_data = await info.json();
        //console.log(api_data);
        res.status(200).json(api_data);
        //await writeFile('./data/flag_data.json', JSON.stringify(api_data, null, 2));
        console.log('API data saved into data/flag_data.json');
    } catch (error) {
        console.error('Error in getFlagInformation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getFlagImage = async (req, res) => {
    try {
        const { code, name, options } = generateFlagQuestion(4);
        const response = await fetch(`https://flagcdn.com/256x192/${code}.png`);

        if (!response.ok) {
            throw new Error(`Flag CDN returned ${response.status}`);
        }

        console.log('Flag image fetched successfully');
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        res.set('Cache-Control', 'no-store');
        res.status(200).json({
            imageBuffer: imageBuffer.toString('base64'),
            countryName: name,
            options
        });
    } catch (error) {
        console.error('Error in getFlagImage:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}