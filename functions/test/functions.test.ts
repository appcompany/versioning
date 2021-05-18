import { describe, it } from 'mocha'
import * as chai from 'chai'
import { categories } from '../src/change-categories';
import chaiHttp = require('chai-http')

chai.use(chaiHttp)
const { expect } = chai

describe('listCategories', () => {

  it('contains all keys', () => {
    return chai.request('http://localhost:9821')
    .get('/versioning-api/eur3/listCategories')
    .then(res => {
      expect(res.status).to.equal(200)
      for (let category of categories) {
        for (let key of category.keys) {
          expect(res.text).to.contain(key)
        }
      }
    })
  })

})

describe('verifyMessage', () => {

  it('should succeed correctly', () => {
    return chai.request('http://localhost:9821')
    .post('/versioning-api/eur3/verifyMessage')
    .send({ 
      title: 'changed some changes and tested some features', 
      message: '[change]> this is a change\n[feat]> this is a feature' 
    })
    .then(res => {
      expect(res.status).to.equal(200)
      expect(res.body.valid).to.equal(true)
      expect(res.body.title).to.equal('changed some changes and tested some features')
      expect(res.body.message).to.equal('[change]> this is a change\n[feat]> this is a feature')
    })
  })

  it('should fail with changelog tags in the title', () => {
    return chai.request('http://localhost:9821')
    .post('/versioning-api/eur3/verifyMessage')
    .send({ title: '[feat]> test title', message: '[feat]> test message' })
    .then(res => {
      expect(res.status).to.equal(400)
      expect(res.body.valid).to.equal(false)
      expect(res.body.errors).to.have.length(1).and.to.contain('title contains changelog tags')
      expect(res.body.title).to.equal('[feat]> test title')
      expect(res.body.message).to.equal('[feat]> test message')
    })
  })

  it('should fail when all lines are missing a changelog tag', () => {
    return chai.request('http://localhost:9821')
    .post('/versioning-api/eur3/verifyMessage')
    .send({ title: 'test title', message: 'test message' })
    .then(res => {
      expect(res.status).to.equal(400)
      expect(res.body.valid).to.equal(false)
      expect(res.body.errors).to.have.length(1).and.to.contain('some lines in the message are missing changelog tags')
      expect(res.body.title).to.equal('test title')
      expect(res.body.message).to.equal('test message')
    })
  })

  it('should fail when not all lines contain a changelog tag', () => {
    return chai.request('http://localhost:9821')
    .post('/versioning-api/eur3/verifyMessage')
    .send({ title: 'test title', message: '[feat]>test message\nthis is a line without a tag' })
    .then(res => {
      expect(res.status).to.equal(400)
      expect(res.body.valid).to.equal(false)
      expect(res.body.errors).to.have.length(1).and.to.contain('some lines in the message are missing changelog tags')
      expect(res.body.title).to.equal('test title')
      expect(res.body.message).to.equal('[feat]>test message\nthis is a line without a tag')
    })
  })

})