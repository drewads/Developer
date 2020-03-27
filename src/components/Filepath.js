'use strict';

class DirPath {
  	constructor(pathArray = []) {
      	DirPath.parentLabel = '..';
      
        this.path = pathArray;
    }
  
  	moveTo(dirName) {
      	this.path = (dirName === DirPath.parentLabel ? this.path.slice(0, -1) : this.path.concat(dirName));
    }
    
    isAncestorOf (otherPath) {	
        for (let i = 0; i < this.path.length; i++) {
            if (!otherPath.path[i] || this.path[i] !== otherPath.path[i]) {
                return false;
            }
        }

        return true;
    }

    length() {
        return this.path.length;
    }

    equals(otherPath) {
        return this.length() === otherPath.length() && this.isAncestorOf(otherPath);
    }
    
    toString() {
        let path = '/';

        for (const elem of this.path) {
          	path += elem + '/';
        }

        return path;
    }
}

class FilePath extends DirPath {
  	constructor(DirPath, file) {
      	super(DirPath.path);
      
      	this.file = file;
    }
    
    isAncestorOf(otherFilepath) {
        if (!otherFilepath) return false;

        let i = 0
        for (; i < this.path.length; i++) {
            if (!otherFilepath.path[i] || this.path[i] !== otherFilepath.path[i]) {
                return false;
            }
        }

        return otherFilepath.path[i] && this.file === otherFilepath.path[i];
    }

    substitutePrefix(oldPrefix, newPrefix) {
        // oldPrefix and newPrefix are FilePath objects
        this.path = newPrefix.path.concat(newPrefix.file, this.path.slice(oldPrefix.length()));
    }

    isPathToParent() {
        return this.file === DirPath.parentLabel;
    }

    length() {
        return super.length() + 1;
    }
  
  	toString() {
      	return super.toString() + this.file;
    }

    equals(otherFilepath) {
        return otherFilepath && this.toString() === otherFilepath.toString();
    }
}

export { DirPath, FilePath };