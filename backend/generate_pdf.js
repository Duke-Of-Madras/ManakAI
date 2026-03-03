const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Sample_Curriculum_2025.pdf'));

doc.fontSize(25).text('B.Tech Curriculum 2025 - Computer Science', { align: 'center' });
doc.moveDown();

doc.fontSize(16).text('Semester 1 & 2');
doc.fontSize(12).text('- Introduction to Programming (C++)');
doc.text('- Basic Electrical Engineering');
doc.text('- Engineering Mathematics');
doc.text('- Physics & Chemistry Fundamentals');
doc.moveDown();

doc.fontSize(16).text('Semester 3 & 4');
doc.fontSize(12).text('- Data Structures and Algorithms');
doc.text('- Database Management Systems (SQL)');
doc.text('- Operating Systems');
doc.text('- Object Oriented Programming (Java)');
doc.moveDown();

doc.fontSize(16).text('Semester 5 & 6');
doc.fontSize(12).text('- Software Engineering');
doc.text('- Computer Networks');
doc.text('- Web Technologies (HTML, CSS, JS)');
doc.text('- Artificial Intelligence Fundamentals (Search algorithms & Logic)');
doc.moveDown();

doc.fontSize(10).fillColor('gray').text('Note: This curriculum has not been updated to include LLMs, Prompt Engineering, or Deep Learning frameworks as per the 2026 guidelines.', { align: 'center', underline: true });

doc.end();
console.log("PDF created successfully!");
