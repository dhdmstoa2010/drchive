import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "../../styles/theme";
import { fieldStyles, selectStyles } from "../../styles/select";

export const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.ink};
`;

export const Subtitle = styled.div`
  font-size: 14px;
  color: ${colors.inkSoft};
  margin-top: 4px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
`;

export const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.inkFaint};
  margin-bottom: 6px;
`;

export const Select = styled.select`
  ${selectStyles}
`;

export const TextInput = styled.input`
  ${fieldStyles}
`;

export const DescriptionTextArea = styled.textarea`
  ${fieldStyles}
  resize: none;
  min-height: 72px;
`;

export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const UploadZone = styled.label<{ $hasPreview: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px dashed rgba(70, 55, 50, 0.22);
  background: #fff;
  color: ${colors.inkFaint};
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover {
    border-color: ${colors.lavender};
    background: ${colors.lavenderBg};
  }

  ${({ $hasPreview }) =>
    $hasPreview &&
    css`
      border-style: solid;
      border-color: rgba(70, 55, 50, 0.16);
    `}

  &:hover .change-overlay {
    opacity: 1;
  }
`;

export const UploadIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`;

export const UploadHint = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

export const UploadSubHint = styled.span`
  font-size: 11px;
  color: ${colors.inkFaint};
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ChangeOverlay = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  padding: 8px 0;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(0deg, rgba(20, 20, 30, 0.6), transparent);
  opacity: 0;
  transition: opacity 150ms ease;
`;

export const ErrorText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.coralDeep};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.inkFaint};
  padding: 0 12px;
  background: none;
  border: none;
  cursor: pointer;
`;
