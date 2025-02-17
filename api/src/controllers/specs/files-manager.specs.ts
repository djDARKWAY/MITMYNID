import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export const uploadImage = async (data: string, path: string, name: string) => {

  //let base64Image : string | undefined = data.split(';base64,').pop();

  const fileName = `${uuidv4().substring(0, 13)}`;
  const fileNameXs = `${fileName}_xs`;
  const pathPlusName: string = path + fileName;

  try {
    // path, content
    // fs.writeFileSync(pathPlusName, data, 'base64');

    if (!fs.existsSync(path))
      fs.mkdirSync(path)

    const imgBuffer = Buffer.from(data, 'base64');

    await sharp(imgBuffer).webp({ quality: Math.min(Math.max(Math.floor((1000000 / imgBuffer.length) * 100), 25), 100) }).toFile(pathPlusName + '.webp');
    await sharp(imgBuffer).webp().resize({ width: 300, height: 300, fit: 'inside' }).toFile(path + fileNameXs + '.webp');

    // if (imgBuffer.length > 1000000)
    //   await sharp(imgBuffer).jpeg({ quality: Math.floor((1000000 / imgBuffer.length) * 100) + 1 }).toFile(pathPlusName + '.jpeg');
    // else
    //   await sharp(imgBuffer).jpeg({ quality: 100 }).toFile(pathPlusName + '.jpeg');

  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
  finally {
    return pathPlusName;
  }
}

export const uploadPDF = async (data: string, path: string, name: string) => {

  //let base64Image : string | undefined = data.split(';base64,').pop();
  name = name.slice(0, -4) //remove ".pdf"
  name = name.normalize("NFD").replace(/\p{Diacritic}/gu, "") //remove acentos ex:"áèïõû"
  name = name.replace(/[^a-zA-Z0-9 ]/g, "") //remove caracteres especiais
  name = name.replace(/\s+/g, '_'); //remove espaços

  const fileName = `${name}_${uuidv4().substring(0, 4)}.pdf`;
  const pathPlusName: string = path + fileName;

  try {

    if (!fs.existsSync(path))
      fs.mkdirSync(path)

    // path, content
    fs.writeFileSync(pathPlusName, data, 'base64');


  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
  finally {
    return pathPlusName;
  }

}

export const deleteImage = async (data: string) => {

  try {
    // path, content
    fs.unlinkSync(data);
  } catch (error) {
    console.error(`Got an error trying to delete a file: ${error.message}`);
  }

}

export const getImage = async (fileString: string) => {

  try {
    // path, content
    const resStat = fs.statSync(fileString);
    return resStat.birthtimeMs
  } catch (error) {
    console.error(`Got an error trying to delete a file: ${error.message}`);
  }

}
