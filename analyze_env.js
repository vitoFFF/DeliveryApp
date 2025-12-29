const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('--- RAW CONTENT START ---');
    console.log(content);
    console.log('--- RAW CONTENT END ---');

    console.log('\n--- LINE BY LINE ANALYSIS ---');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        console.log(`Line ${index + 1}: [Length: ${line.length}] ${JSON.stringify(line)}`);
    });
} catch (e) {
    console.error('Error reading .env:', e.message);
}
