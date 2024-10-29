import * as fileUtil from '../util/fileUtil.mjs';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('validatePath method', () => {
  it('should return true when path exists', async () => {
    const result = await fileUtil.validatePath('./test/fakeFile.txt');
    expect(result).to.be.true;
  });

  it('should return false when file does not exist', async () => {
    const result = await fileUtil.validatePath('./void/nofiledandwajdwadaw.txt');
    expect(result).to.be.false;
  });
});

describe('isFile method', () => {
  it('should return true if it is a file', async () => {
    const result = await fileUtil.isFile('./test/fakeFile.txt');
    expect(result).to.be.true;
  });

  it('should return false if it is not a file', async () => {
    const result = await fileUtil.isFile('./test/directory');
    expect(result).to.be.false;
  });
});

describe('readData method', () => {
  it('should return parsed JSON content if it is a valid file path', async () => {
    const result = await fileUtil.readData('./test/fakeFile.txt');
    expect(result).to.deep.equal({ name: 'TommyT', department: 'CS' });
  });

  it('should throw an error when the file does not exist', async () => {
    await expect(
      fileUtil.readData('./dwadawdw')).
      to.be.rejectedWith(Error, /File does not exist or is not a file/);
  });

  it('should throw an error when it isnt a file', async () => {
    await expect(
      fileUtil.readData('./fakeDirectory')).
      to.be.rejectedWith(Error, /File does not exist or is not a file/);
  });
});