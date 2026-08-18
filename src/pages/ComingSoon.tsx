import {
  PageWrapper,
  PageTitle,
  PageSubtitle,
  PlaceholderCard,
} from "./style/ComingSoon.style";

type ComingSoonProps = {
  title: string;
  description: string;
};

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <PageWrapper>
      <div>
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{description}</PageSubtitle>
      </div>

      <PlaceholderCard interactive={false}>
        준비 중이에요. 곧 만나볼 수 있어요!
      </PlaceholderCard>
    </PageWrapper>
  );
}
