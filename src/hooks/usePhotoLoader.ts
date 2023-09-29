import { actionSheetController, alertController, isPlatform } from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Ref } from "vue";
import { Capacitor } from "@capacitor/core";
import useRoles from "./useRole";
import { RoleEnum } from "@/generated/graphql";

enum actionTypesEnum {
  Delete = "DELETE",
  MakeAPhoto = "MAKE_A_PHOTO",
  PhotoLibrary = "PHOTO_LIBRARY",
  UploadFile = "UPLOAD_FILE"
}

export const usePhotoLoader = (setValue: (photo?: string) => void) => {
  const { role } = useRoles();
  const openLoadOptions = async (
    value?: Ref<string | undefined>, uploadBtn = false
  ): Promise<void> => {
    const actionSheet = await actionSheetController.create({
      mode: "ios",
      cssClass: role === RoleEnum.User ? "native-app" : "",
      buttons: [
        ...(value?.value
          ? [
              {
                text: "Delete photo",
                role: "destructive",
                data: {
                  type: actionTypesEnum.Delete,
                },
              },
            ]
          : []),
        {
          text: "Make a photo",
          data: {
            type: actionTypesEnum.MakeAPhoto,
          },
        },
        {
          text: "Photo library",
          data: {
            type: actionTypesEnum.PhotoLibrary,
          },
        },
        ...(uploadBtn 
          ? [
            {
              text: "Upload file",
              data: {
                type: actionTypesEnum.UploadFile,
              }
            },
          ] 
          : []),
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });

    await actionSheet.present();

    const { data } = await actionSheet.onWillDismiss();
    const type: actionTypesEnum = data?.type;

    const actions = {
      [actionTypesEnum.Delete]: () => setValue(),
      [actionTypesEnum.MakeAPhoto]: () => getPhoto(CameraSource.Camera),
      [actionTypesEnum.PhotoLibrary]: () => getPhoto(CameraSource.Photos),
      [actionTypesEnum.UploadFile]: () => uploadFile()
    };

    if (actions[type]) {
      actions[type]();
    }
  };

  const getPhoto = async (source: CameraSource): Promise<void> => {
    if (isPlatform("capacitor")) {
      const permissions = await Camera.requestPermissions();
      if (
        (source === CameraSource.Camera && permissions.camera === "denied") ||
        (source === CameraSource.Photos && permissions.photos === "denied")
      ) {
        const alert = await alertController.create({
          header: "Permissions denied",
          message:
            source === CameraSource.Camera
              ? "You have denied the app from using the camera"
              : "You have denied the app access to your photos",
          buttons: ["OK"],
        });

        await alert.present();
        return;
      }
    }

    const image = await Camera.getPhoto({
      width: 264,
      height: 264,
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source,
    });

    setValue(`data:image/jpeg;base64,${image.base64String}`);
  };

  const uploadFile = () => {
    console.log('uploadFile');
  }

  return {
    getPhoto,
    openLoadOptions,
  };
};
