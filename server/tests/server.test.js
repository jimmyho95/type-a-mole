// tests/server.test.js
const request = require('supertest');
const express = require('express');
const app = require('../app'); // make sure your server exports the app instance, not app.listen()

// Wrap with describe block for each route
describe('Word List API', () => {
  it('should return the default word list', async () => {
    const res = await request(app).get('/api/words/list?list=defaultWords');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(typeof res.body[0]).toBe('string');
  });

  it('should return 404 for non-existent list', async () => {
    const res = await request(app).get('/api/words/list?list=notARealList');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('List Available Word Lists', () => {
  it('should return an array of available word list names', async () => {
    const res = await request(app).get('/api/words/lists');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(typeof res.body[0]).toBe('string');
  });
});

describe('Score Submission', () => {
  it('should accept a valid score submission', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({
        player: 'TestPlayer',
        score: 10,
        wpm: 20,
        difficulty: 'mid'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  it('should reject an incomplete submission', async () => {
    const res = await request(app)
      .post('/api/scores')
      .send({ player: 'Incomplete' });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
