const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const messages = {
  data: [],

  addMessage: function(title, body, name) {
    const message = {
      title: title,
      body: body,
      name: name,
      timestamp: new Date().toLocaleString()
    };

    this.data.unshift(message); 
    this.saveMessages();
  },

  saveMessages: function() {
    fs.writeFileSync('messages.json', JSON.stringify(this.data));
  },

  loadMessages: function() {
    try {
      const storedMessages = fs.readFileSync('messages.json');
      this.data = JSON.parse(storedMessages);
    } catch (error) {
      this.data = [];
    }
  }
};

app.get('/', (req, res) => {
  messages.loadMessages();
  res.render('index', { messages: messages.data });
});

app.post('/message', (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const name = req.body.name;

  if (title && body && name) {
    messages.addMessage(title, body, name);
  }

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
