import type { Photo } from "../types";
import {
  StyledCard,
  ImageWrap,
  PhotoImg,
  PlaceTag,
  CardFooter,
  PlaceName,
  PlaceMeta,
  SemesterTag,
} from "./style/PhotoCard.style";

type PhotoCardProps = {
  photo: Photo;
  index: number;
};

export default function PhotoCard({ photo, index }: PhotoCardProps) {
  return (
    <StyledCard>
      <ImageWrap $placeIndex={index}>
        {photo.imageUrl && (
          <PhotoImg src={photo.imageUrl} alt={photo.place} />
        )}
        <PlaceTag>PHOTO · {photo.place}</PlaceTag>
      </ImageWrap>
      <CardFooter>
        <div>
          <PlaceName>{photo.place}</PlaceName>
          <PlaceMeta>
            {photo.date} · {photo.uploader}
          </PlaceMeta>
        </div>
        <SemesterTag>{photo.semesterLabel}</SemesterTag>
      </CardFooter>
    </StyledCard>
  );
}
