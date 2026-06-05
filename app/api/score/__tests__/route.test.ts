/**
 * @jest-environment node
 */

const mockCreate = jest.fn()

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}))

import { POST } from '../route'
import { NextRequest } from 'next/server'

beforeEach(() => {
  mockCreate.mockReset()
})

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/score', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

it('returns pass and feedback on valid response', async () => {
  mockCreate.mockResolvedValueOnce({
    content: [{ type: 'text', text: '{"pass":true,"feedback":"Good answer"}' }],
  })

  const req = makeRequest({
    sectionId: 'before-you-reply',
    questionText: 'Test question',
    answer: 'Test answer',
    criteria: 'Test criteria',
  })

  const res = await POST(req)
  const data = await res.json()
  expect(res.status).toBe(200)
  expect(data.pass).toBe(true)
  expect(data.feedback).toBe('Good answer')
})

it('returns 500 on Anthropic error', async () => {
  mockCreate.mockRejectedValueOnce(new Error('API error'))

  const req = makeRequest({
    sectionId: 'before-you-reply',
    questionText: 'Test question',
    answer: 'Test answer',
    criteria: 'Test criteria',
  })

  const res = await POST(req)
  expect(res.status).toBe(500)
})

it('returns 500 on malformed JSON from Anthropic', async () => {
  mockCreate.mockResolvedValueOnce({
    content: [{ type: 'text', text: 'not json' }],
  })

  const req = makeRequest({
    sectionId: 'before-you-reply',
    questionText: 'Test question',
    answer: 'Test answer',
    criteria: 'Test criteria',
  })

  const res = await POST(req)
  expect(res.status).toBe(500)
})

it('returns 500 on wrong response shape from Anthropic', async () => {
  mockCreate.mockResolvedValueOnce({
    content: [{ type: 'text', text: '{"pass":"yes","feedback":"ok"}' }],
  })

  const req = makeRequest({
    sectionId: 'before-you-reply',
    questionText: 'Test question',
    answer: 'Test answer',
    criteria: 'Test criteria',
  })

  const res = await POST(req)
  expect(res.status).toBe(500)
})
