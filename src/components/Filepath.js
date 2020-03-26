'use strict';

class DirPath {
  	constructor(pathArray = []) {
      	DirPath.parentLabel = '..';
      
      	this.path = pathArray;
    }
  
  	moveTo = (dirName) => {
      	this.path = (dirName === DirPath.parentLabel ? this.path.slice(0, -1) : this.path.concat(dirName));
    }
    
    isAncestorOf = (otherPath) => {	
        for (i = 0; i < this.path.length; i++) {
            if (this.path[i] !== otherPath.path[i]) {
                return false;
            }
        }

        return true;
    }
    
    equal = (otherPath) => {
      	return this.path.length === otherPath.path.length && this.isAncestorOf(otherPath);
    }
    
    toString = () => {
        let path = '/';

        for (const elem of this.path) {
          	path += elem + '/';
        }

        return path;
    }
}

class Filepath extends DirPath {
  	constructor(dirArray, file) {
      	super(dirArray);
      
      	this.file = file;
    }
  
  	equal = (otherFilepath) => {
      	return super.equal(otherFilepath) && this.file === otherFilepath.file;
    }
    
    isAncestorOf = (otherFilepath) => {
      	return this.isEqual(otherFilepath);
    }
  
  	toString = () => {
      	return super.toString() + this.file;
    }
}
  	