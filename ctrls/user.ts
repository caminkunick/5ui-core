import { User, updateProfile } from "firebase/auth";
import {
  ref,
  FirebaseStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export namespace UserControl {
  export const changeProfile = (
    storage: FirebaseStorage,
    user: User,
    file: File
  ) => {
    return new Promise<void>((resolve, reject) => {
      const storageRef = ref(storage, `${user.uid}/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef)
            .then((url) => {
              updateProfile(user, { photoURL: url })
                .then(() => resolve())
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };
}
