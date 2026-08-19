import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "./theme";

/** Shared look for every text-like form field (input/textarea/select). */
export const fieldStyles = css`
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid rgba(70, 55, 50, 0.16);
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.ink};
  outline: none;
  box-shadow: 0 1px 2px rgba(20, 20, 30, 0.05);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    border-color: ${colors.lavender};
  }

  &:focus {
    border-color: ${colors.lavender};
    box-shadow: 0 0 0 3px ${colors.lavenderBg};
  }
`;

/** Adds the custom chevron + strips native OS chrome, on top of fieldStyles. */
export const selectStyles = css`
  ${fieldStyles}
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23847a75' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 15px;
`;

/** The one dropdown component every page/modal should use. */
export const Select = styled.select`
  ${selectStyles}
`;
