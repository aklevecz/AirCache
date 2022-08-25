import Link from "next/link";
import _ from "lodash";
import SectionHeading from "./Layout/SectionHeading";
import { colors } from "../libs/constants";
type Props = {
  groups: any[];
  toggleCreateHunt: () => void;
  fetchHuntMetadata: (name: string) => void;
  selectedHunt: string | null;
};
export default function TheirHunts({
  groups,
  toggleCreateHunt,
  fetchHuntMetadata,
  selectedHunt,
}: Props) {
  const hasNoGroups = groups.length === 0;
  return (
    <div className="">
      <SectionHeading>your hunts</SectionHeading>
      {hasNoGroups && <div>You don't have any groups</div>}
      {groups.map((group) => (
        // <Link key={group.name} href={`/hunt/${group.name}`}>
        <div
          onClick={() => fetchHuntMetadata(group.name)}
          className="hunt-link"
          style={{
            cursor: "pointer",
            color: selectedHunt === group.name ? colors.red : colors.blue,
          }}
          key={group.name}
        >
          ▶ {_.startCase(group.name)}
        </div>
        // </Link>
      ))}
      <button onClick={toggleCreateHunt} className="mt-5">
        Create New Hunt
      </button>
      <style jsx>{`
        .hunt-link {
          color: #90bcff;
          padding: 4px 0px;
          font-size: 1rem;
          cursor: pointer;
          transition: color 500ms;
        }
      `}</style>
    </div>
  );
}
