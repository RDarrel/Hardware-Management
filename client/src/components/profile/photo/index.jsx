import React from "react";
import { MDBAvatar } from "mdbreact";

const ChangePhoto = ({
  PresetImage,
  auth,
  progressBar,
  handleImageChange,
  image,
  form,
}) => {
  return (
    <div className="mb-3">
      {form._id ? (
        <>
          <MDBAvatar
            tag="img"
            src={image}
            onError={(e) => (e.target.src = PresetImage(auth?.isMale))}
            alt={`preview-${auth._id}`}
            className="z-depth-1 mb-2 mx-auto rounded"
          />

          <p className="text-muted">
            <small>
              {progressBar > -1
                ? "Please wait while we update your profile photo"
                : "Profile photo will be changed automatically"}
            </small>
          </p>
          <label
            htmlFor="changeImage"
            className="btn btn-info btn-sm btn-rounded"
          >
            Upload New Photo
          </label>
          <input
            id="changeImage"
            onChange={handleImageChange}
            type="file"
            className="d-none"
            accept="image/jpeg, image/jpg"
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChangePhoto;
