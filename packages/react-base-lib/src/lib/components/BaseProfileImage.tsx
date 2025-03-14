export interface BaseProfileImageProps {
  className?: string;
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
}

export function BaseProfileImage({
  src,
  className,
}: BaseProfileImageProps): JSX.Element {
  const defaultImageSrc = "https://avatars.githubusercontent.com/u/13117711?s=460&u=7b5e4c4f5e6e8a6d";

  return (
    <img
      alt="Header Profile"
      className={className ?? "w-12 h-12 rounded-full"}
      src={src ?? defaultImageSrc} />
  );
}

export default BaseProfileImage;
