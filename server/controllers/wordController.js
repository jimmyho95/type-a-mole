const path = require('path');
const fs = require('fs');

const WORD_LIST_DIR = path.join(__dirname, '..', 'word-lists');

exports.getFullList = (req, res) => {
    const listName = req.query.list || 'defaultWords';
    const filePath = path.join(WORD_LIST_DIR, `${listName}.json`);

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Word list not found.' });
        }

        const words = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        res.json(words);
    } catch (err) {
        console.error('Error reading word list:', err);
        res.status(500).json({ error: 'Failed to load word list.' });
    }
};

exports.listWordFiles = (req, res) => {
    fs.readdir(WORD_LIST_DIR, (err, files) => {
        if (err) {
            console.error('Error listing word files:', err);
            return res.status(500).json({ error: 'Failed to list word sets.' });
        }

        const wordLists = files
            .filter(file => file.endsWith('.json'))
            .map(file => path.basename(file, '.json'));

        res.json(wordLists);
    });
};
