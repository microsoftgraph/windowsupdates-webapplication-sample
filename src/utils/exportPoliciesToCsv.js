export const exportPoliciesToCsv = (policies) => {
  // headers
  const policiesData = policies.map((policy) => {
    return {
      policyId: policy.id,
      policyName: policy.Name,
      deviceCount: policy.members?.length ?? 0,
      policyType:
        policy.complianceChangeRules.length === 0 ? "Manual" : "Automatic",
    };
  });
  const csvRows = [];
  const headers = Object.keys(policiesData[0]);
  csvRows.push(headers.join(","));
  // rows
  for (const row of policiesData) {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  // download
  const csvString = csvRows.join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
  a.setAttribute("download", "policies.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
