import { VISIBILITY_OPTIONS, type Visibility } from "../../types";
import { Row, Option } from "./style/VisibilityPicker.style";

type VisibilityPickerProps = {
  value: Visibility;
  onChange: (value: Visibility) => void;
};

export function VisibilityPicker({ value, onChange }: VisibilityPickerProps) {
  return (
    <Row>
      {VISIBILITY_OPTIONS.map((opt) => (
        <Option
          key={opt.value}
          type="button"
          $active={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Option>
      ))}
    </Row>
  );
}
