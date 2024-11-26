interface Row {
  id: string;
  title: string;
  count: number;
}

interface StatsTableProps {
  rows: Row[];
}

const StatsTable: React.FC<StatsTableProps> = ({ rows }) => {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
            <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th
                    scope="col"
                    className="font-bold w-[200px] py-2 px-4 border-b border-l text-left"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="font-bold w-[200px] py-2 px-4 border-b border-l text-left"
                  >
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ id, title, count }) => (
                  <tr key={id} className="">
                    <td className="p-2 w-[200px] border-b border-l text-left">
                      {title}
                    </td>
                    <td className="p-2 w-[200px] border-b border-l text-left">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTable;
