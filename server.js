const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

const app = express();
const port = 3000;

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve blog posts
app.get('/api/blog/posts', async (req, res) => {
    try {
        console.log('Attempting to read posts.json from:', path.join(__dirname, 'blog', 'posts.json'));
        const postsJson = await fs.readFile(path.join(__dirname, 'blog', 'posts.json'), 'utf8');
        console.log('Successfully read posts.json:', postsJson);
        res.json(JSON.parse(postsJson));
    } catch (error) {
        console.error('Error loading blog posts:', error);
        res.status(500).json({ error: 'Failed to load blog posts' });
    }
});

// Serve individual blog post
app.get('/api/blog/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        console.log('Attempting to read blog post:', postId);
        const filePath = path.join(__dirname, 'blog', 'posts', `${postId}.md`);
        console.log('Reading from:', filePath);
        const markdown = await fs.readFile(filePath, 'utf8');
        console.log('Successfully read markdown file');
        const html = marked.parse(markdown);
        res.json({ html });
    } catch (error) {
        console.error('Error loading blog post:', error);
        res.status(404).json({ error: 'Blog post not found' });
    }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    console.log('Serving index.html for route:', req.url);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Current directory:', __dirname);
}); 