import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PillButton } from "../components/ui/PillButton";
import { GRADE_FILTERS } from "../constants/grade";
import {
  PageWrapper,
  HeaderRow,
  PageTitle,
  PageSubtitle,
  SearchInput,
  FilterRow,
  EmptyState,
  GroupColumn,
  GroupBlock,
  GroupTitle,
  MemberGrid,
  MemberCard,
  Avatar,
  MemberName,
  MemberMeta,
  MeBadge,
} from "./style/Members.style";

export default function Members() {
  const { currentUser, users } = useAuth();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");

  const filtered = users.filter((u) => {
    const matchesGrade = gradeFilter === "all" || u.grade === gradeFilter;
    const matchesSearch = u.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const groups = useMemo(() => {
    const byKey = new Map<string, typeof filtered>();
    filtered.forEach((u) => {
      const key = `${u.grade}학년 ${u.className}반`;
      byKey.set(key, [...(byKey.get(key) ?? []), u]);
    });
    return [...byKey.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "ko"))
      .map(([label, members]) => ({
        label,
        members: members.sort((a, b) => a.name.localeCompare(b.name, "ko")),
      }));
  }, [filtered]);

  return (
    <PageWrapper>
      <HeaderRow>
        <div>
          <PageTitle>Members</PageTitle>
          <PageSubtitle>
            가입한 학교 구성원 {users.length}명을 확인할 수 있어요.
          </PageSubtitle>
        </div>
        <FilterRow>
          <SearchInput
            placeholder="이름으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {GRADE_FILTERS.map((g) => (
            <PillButton
              key={g.id}
              type="button"
              active={gradeFilter === g.id}
              onClick={() => setGradeFilter(g.id)}
            >
              {g.label}
            </PillButton>
          ))}
        </FilterRow>
      </HeaderRow>

      {groups.length === 0 ? (
        <EmptyState interactive={false}>일치하는 구성원이 없어요.</EmptyState>
      ) : (
        <GroupColumn>
          {groups.map((group) => (
            <GroupBlock key={group.label}>
              <GroupTitle>
                {group.label} · {group.members.length}명
              </GroupTitle>
              <MemberGrid>
                {group.members.map((u) => (
                  <MemberCard key={u.id} interactive={false}>
                    <Avatar>{u.name.slice(0, 2)}</Avatar>
                    <div>
                      <MemberName>
                        {u.name}
                        {u.id === currentUser?.id && <MeBadge>나</MeBadge>}
                      </MemberName>
                      <MemberMeta>
                        {u.grade}학년 {u.className}반
                      </MemberMeta>
                    </div>
                  </MemberCard>
                ))}
              </MemberGrid>
            </GroupBlock>
          ))}
        </GroupColumn>
      )}
    </PageWrapper>
  );
}
