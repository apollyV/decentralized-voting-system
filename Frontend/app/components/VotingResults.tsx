export default function VotingResults({ percentFor }: { percentFor: number }) {
  const roundedPercentFor = Math.round(percentFor * 10) / 10; // Arrondi au dixième
  const roundedPercentAgainst = Math.round((100 - percentFor) * 10) / 10;

  return (
    <main>
      <section
        className="
        h-6
        w-full
        bg-danger-500
        rounded-lg
        text-white
        font-bold
        text-xs
        flex
        flex-row
        justify-between
        place-items-center
      "
      >
        <div
          className="h-full bg-success-500 rounded-lg pl-1 flex place-items-center"
          style={{ width: `${roundedPercentFor}%` }}
        >
          {roundedPercentFor}%
        </div>
        <p className="pr-1 absolute right-0">{roundedPercentAgainst}%</p>
      </section>
    </main>
  );
}
