
'use strict';

class DirPath {
  	constructor(pathArray = []) {
      	DirPath.parentLabel = '..';
      
      	this.path = pathArray;
    }
  
  	moveTo = (dir) => {
      	if (dir === DirPath.parentLabel) {
          	// slice to one less if path.length > 0
        } else {
          	// concat dir onto the end of path
        }
    }
    
    isAncestor = (otherPath) => {
     	// TODO: write this function that compares two paths 	
    }
    
    isEqual = () => {
      	// TODO: write equality function
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
  
  	isEqual = (otherPath) => {
      	// TODO: write equality
    }
    
    isAncestor = (otherPath) => {
      	return this.isEqual(otherPath);
    }
  
  	toString = () => {
      	return super.toString() + this.file;
    }
}
  	