import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { TimeService } from './time.service';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class UploadFileService {
    constructor(
        private db: AngularFireDatabase,
        private timeService: TimeService
    ) { }
    // private basePath:string = '/uploads';
    // uploads: FirebaseListObservable<Upload[]>;
    private uploadTask: firebase.storage.UploadTask;

    pushUpload(data, storageUrl, firebaseUrl, fieldUpdate, name?) {
        let subject = new Subject<boolean>();
       let nameFile = '_File_' + this.timeService.getTimeUnixCurrent();

        return new Promise(async resolve => {
             let storageRef = firebase.storage().ref();
 
             let res = [];
             res = data.name.split('.');
             res = res[res.length - 1];

             let file = name ? name : nameFile + '.' + res;
             let uploadTask = storageRef.child(`${storageUrl}/${file}`).put(data);
             uploadTask.on(
                 firebase.storage.TaskEvent.STATE_CHANGED,
                 snapshot => { },
                 error => {
                     // upload failed
                     subject.next(false);
                 },
                 () => {
 
                     uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                         let data = {
                             [fieldUpdate]: downloadURL
                         };
                         this.saveFieldData(data, firebaseUrl, fieldUpdate);
                         resolve(downloadURL);
                     });
                 }
             );
         })
    }

    private saveFieldData(data, firebaseUrl, fieldUpdate) {
        if (fieldUpdate) {
            this.db.object(`${firebaseUrl}`).update(data);
        }
    }
}
