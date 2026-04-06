'use client';
import CustomTextArea from "@/components/AccountDetailsDashboard/CustomTextArea";
import CustomInputField from "@/components/AccountDetailsDashboard/CustomInputField";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
const unkownProfile = "/images/unkown-profile.png";
import { useEffect, useState } from "react";
import { useUserHook } from "@/helper/userHook";
import { User } from "@/models/user";
import { useDispatch } from "react-redux";
import { login } from "@/lib/slices/authSlice";
import { useTrans } from "@/utils/translation";

const AccountDetailsDashboard = () => {
  const [avatarHover, setAvatarHover] = useState(false);

  const [avatar, setAvatar] = useState<File | null>();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const dispatch = useDispatch();
  const { getUserData, updateUserData, user, loading } = useUserHook();

  const [userData, setUserData] = useState<User>({
    id: 0,
  });

  const handleSocialMediaChange = (platform: string, value: string) => {
    const updatedSocialMedia = [...(userData.social_media || [])];
    const index = updatedSocialMedia.findIndex(
      (item) => item.platform === platform,
    );

    if (value.trim() === "") {
      if (index !== -1) {
        updatedSocialMedia.splice(index, 1);
      }
    } else if (index !== -1) {
      updatedSocialMedia[index].value = value;
    } else {
      updatedSocialMedia.push({ platform, value });
    }
    setUserData({ ...userData, social_media: updatedSocialMedia });
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
      dispatch(login({ user: user }));
    }
  }, [user]);

  useEffect(() => {
    getUserData();
  }, []);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const getAvatarSrc = () => {
    if (avatar) {
      return URL.createObjectURL(avatar);
    }
    return userData.avatar || unkownProfile;
  };

  const { t } = useTrans();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("account_details.title")}
          </h1>
          <p className="text-gray-500">
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* Profile Picture Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {t("account_details.avatar")}
            </h2>
            <div className="flex items-center gap-6">
              <div
                className="relative group"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md transition-all duration-300 group-hover:border-primary/30">
                  <img
                    src={getAvatarSrc()}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                </div>
                {avatarHover && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white size-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    aria-label="Remove avatar"
                  >
                    <CloseIcon className="!text-[16px]" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="avatar-upload"
                  className={`inline-block px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-all duration-200 ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {t("account_details.upload_avatar")}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInputField
                  value={userData.first_name ?? ""}
                  onChange={(s: string) =>
                    setUserData({ ...userData, first_name: s || "" })
                  }
                  title={t("account_details.first_name")}
                  required
                  disabled={loading}
                />
                <CustomInputField
                  value={userData.last_name ?? ""}
                  onChange={(s: string) =>
                    setUserData({ ...userData, last_name: s || "" })
                  }
                  title={t("account_details.last_name")}
                  required
                  disabled={loading}
                />
              </div>
              <CustomInputField
                value={userData.display_name || ""}
                onChange={(s: string) =>
                  setUserData({ ...userData, display_name: s })
                }
                title={t("account_details.display_name")}
                description={t("account_details.display_name_description")}
                required
                disabled={loading}
              />
              <CustomInputField
                value={userData.email || ""}
                onChange={(s: string) => setUserData({ ...userData, email: s })}
                title={t("account_details.email")}
                required
                disabled={loading}
              />
              <CustomTextArea
                value={userData.bio || ""}
                onChange={(s: string) => setUserData({ ...userData, bio: s })}
                title={t("account_details.biography")}
                disabled={loading}
              />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Social Media Links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Social Media
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInputField
                  value={
                    userData.social_media?.find(
                      (item) => item.platform === "instagram",
                    )?.value || ""
                  }
                  onChange={(s: string) =>
                    handleSocialMediaChange("instagram", s)
                  }
                  title={t("account_details.instagram")}
                  disabled={loading}
                />
                <CustomInputField
                  value={
                    userData.social_media?.find(
                      (item) => item.platform === "facebook",
                    )?.value || ""
                  }
                  onChange={(s: string) =>
                    handleSocialMediaChange("facebook", s)
                  }
                  title={t("account_details.facebook")}
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInputField
                  value={
                    userData.social_media?.find(
                      (item) => item.platform === "pinterest",
                    )?.value || ""
                  }
                  onChange={(s: string) =>
                    handleSocialMediaChange("pinterest", s)
                  }
                  title={t("account_details.pinterest")}
                  disabled={loading}
                />
                <CustomInputField
                  value={
                    userData.social_media?.find(
                      (item) => item.platform === "linkedin",
                    )?.value || ""
                  }
                  onChange={(s: string) =>
                    handleSocialMediaChange("linkedin", s)
                  }
                  title={t("account_details.linkedin")}
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Preferences
            </h2>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={userData.available_for_hire ?? false}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    available_for_hire: e.target.checked || false,
                  });
                }}
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                disabled={loading}
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {t("account_details.available_for_hire")}
              </span>
            </label>
          </section>

          <hr className="border-gray-200" />

          {/* Password Change */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {t("account_details.password_change")}
            </h2>
            <div className="space-y-4">
              <CustomInputField
                value={oldPassword}
                onChange={(s: string) => setOldPassword(s)}
                title={t("account_details.current_password")}
                disabled={loading}
                type="password"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInputField
                  value={newPassword}
                  onChange={(s: string) => setNewPassword(s)}
                  title={t("account_details.new_password")}
                  disabled={loading}
                  type="password"
                />
                <CustomInputField
                  value={reNewPassword}
                  onChange={(s: string) => setReNewPassword(s)}
                  title={t("account_details.confirm_new_password")}
                  disabled={loading}
                  type="password"
                />
              </div>
              <p className="text-sm text-gray-500">
                Password must be at least 8 characters long and include
                uppercase, lowercase, and numbers.
              </p>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              disabled={loading}
              onClick={() => {
                updateUserData(
                  userData,
                  oldPassword,
                  newPassword,
                  reNewPassword,
                  avatar,
                );
              }}
              className="px-8 py-3 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("account_details.loading")
                : t("account_details.save_changes")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsDashboard;
