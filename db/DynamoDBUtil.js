export class DynamoDBUtil {
    removeEmptyStrings(data: any) {
      this.removeEmptyStringsRecursive(data, []);
    }
  
    private removeEmptyStringsRecursive(data: any, processedObjects: Array<any>) {
      if (processedObjects.includes(processedObjects)) {
        return;
      }
      processedObjects.push(data);
  
      for (var name in data) {
        let value = data[name];
        if (value === '') {
          delete data[name];
        } else if (typeof value === 'object') {
          this.removeEmptyStringsRecursive(data[name], processedObjects);
        }
      }
    }
  }
  