import { findPhotoCredit, photoUrl } from "@/data/photoCredits";

type HomePhotoProps = {
  homeId: string;
  sizes: string;
  className?: string;
  isDecorative?: boolean;
  isPriority?: boolean;
};

export function HomePhoto({ homeId, sizes, className, isDecorative = false, isPriority = false }: HomePhotoProps) {
  const credit = findPhotoCredit(homeId);
  const alt = isDecorative ? "" : credit.alt;
  const loading = isPriority ? "eager" : "lazy";

  return (
    <img
      src={photoUrl(homeId, 600)}
      srcSet={`${photoUrl(homeId, 600)} 600w, ${photoUrl(homeId, 1200)} 1200w`}
      sizes={sizes}
      width={1200}
      height={800}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      data-photo={homeId}
    />
  );
}
