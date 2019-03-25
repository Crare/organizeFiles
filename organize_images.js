// script that organizes files in folder based on their name.
const fs = require('fs');

const moveFileTypes = ['.jpg', '.JPG', '.mp4', '.CR2'];

const path = "./organize/";
const filespath = "./files/";
fs.readdir(path, 'utf-8', (err, filenames) => {
    if(err) throw err;

    console.log('getting jpgs from ' + filenames.length + ' files.');
    let files = getFiles(filenames);

    console.log('making sub-directories for ' + files.length + ' files.');
    let directories = makeDirectories(files);
    
    console.log('moving ' + files.length + ' to ' + directories.length + ' directory/ies.');
    moveFilesToDirectories(directories, files);
})

moveFilesToDirectories = (directories, files) => {
    for(let i = 0; i < files.length; i++) {
        for(let j = 0; j < directories.length; j++) {
            
            let filepath = path + files[i];
            let stats = fs.statSync(filepath);
            let mtime = stats.mtime.getFullYear().toString();

            let filetype = '.' + getFileExtension(files[i]);

            let newFilename = stats.mtime.getFullYear()
                + "_" + ((stats.mtime.getMonth()+1) < 10 ? '0' + (stats.mtime.getMonth()+1) : (stats.mtime.getMonth()+1))
                + "_" + (stats.mtime.getDate() < 10 ? '0' + stats.mtime.getDate() : stats.mtime.getDate())
                + "_" + (stats.mtime.getHours() < 10 ? '0' + stats.mtime.getHours() : stats.mtime.getHours())
                + "_" + (stats.mtime.getMinutes() < 10 ? '0' + stats.mtime.getMinutes() : stats.mtime.getMinutes())
                + "_" + (stats.mtime.getSeconds() < 10 ? '0' + stats.mtime.getSeconds() : stats.mtime.getSeconds())
                + filetype;

            if (mtime === directories[j]) {
                let oldPath = path + files[i];
                // let newPath = path + directories[j] + '/' + files[i];
                let newPath = filespath + directories[j] + '/' + newFilename; 
                fs.renameSync(oldPath, newPath);
                // console.log('moved file: "' + oldPath + '" to "' + newPath +'".');
                break;
            }
        }
    }
}

getFileExtension = (filename) => {
    return filename.split('.').pop();
}

makeDirectories = (jpgs) => {
    let directoryNames = [];
    for(let i = 0; i < jpgs.length; i++) {
        let filepath = path + jpgs[i];
        let stats = fs.statSync(filepath);
        let dirname = stats.mtime.getFullYear().toString();
        if (!directoryNames.includes(dirname)) {
            directoryNames.push(dirname);
        }
    }
    for(let i = 0; i < directoryNames.length; i++) {
        let dirpath = directoryNames[i];
        fs.mkdir(dirpath, (e) => {
            if(!e || (e && e.code === 'EEXIST')){
                //do something with contents
                console.log('error: ', e);
            } else {
                //debug
                console.log(e);
            }
        });
    }
    return directoryNames;
}

getFiles = (filenames) => {
    let files = [];
    for (let i = 0; i < filenames.length; i++) {
        if(endsWithAny(moveFileTypes, filenames[i])) {
            files.push(filenames[i]);
        }
    }
    return files;
}

endsWithAny = (suffixes, string) => {
    return suffixes.some((suffix) => {
        return string.endsWith(suffix);
    });
}
