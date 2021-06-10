import { expect } from 'chai';
import { Version } from '../src/version-item';
import { describe } from 'mocha';

describe('Version Item', () => {
  describe('creation', () => {
    it('live should work', () => {
      const version = new Version({
        version: '1.0.0',
        track: 'live',
        build: 1,
        commits: [{
          message: '[feat]> new feature\n[fix]> a fix\n[doc]> added a doc',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0-live/#1');
    });

    it('beta should work', () => {
      const version = new Version({
        version: '1.0.0-beta/#42',
        track: 'beta',
        build: 51,
        commits: [{
          message: '[feat]> new feature\n[fix]> a fix',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0-beta/#51');
    });

    it('alpha should work', () => {
      const version = new Version({
        version: '1.0.0-alpha/#22',
        track: 'alpha',
        build: 72,
        commits: [{
          message: '[change]> changed feature\n[fix]> a fix',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0-alpha/#72');
    });
  });
});
