const router = require('express').Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// ✅ GET all todos for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).send('Error fetching todos');
  }
});

// ✅ POST create new todo
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text is required');

  try {
    const todo = new Todo({ text, userId: req.user.userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).send('Error creating todo');
  }
});

// ✅ DELETE a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).send('Todo not found');
    res.status(200).send('Deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting todo');
  }
});

// ✅ UPDATE a todo (e.g. mark as completed)
router.put('/:id', auth, async (req, res) => {
  const { completed, text } = req.body;
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { completed, text },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).send('Todo not found');
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).send('Error updating todo');
  }
});

module.exports = router;
