const DATASETS = {
  summer: { file: 'data/summer_programs.csv', label: 'Summer programs', url: 'summer-programs.html', icon: 'sun' },
  scholarships: { file: 'data/scholarships.csv', label: 'Scholarships', url: 'scholarships.html', icon: 'cap' },
  courseware: { file: 'data/courseware.csv', label: 'Courseware', url: 'courseware.html', icon: 'book' },
  flyins: { file: 'data/fly_in_programs.csv', label: 'Fly-in programs', url: 'fly-in-programs.html', icon: 'plane' },
  testing: { file: 'data/testing.csv', label: 'Testing & fee waivers', url: 'testing.html', icon: 'clipboard' }
};

const HEADER_ALIASES = {
  title: 'title', category: 'category', summary: 'summary', deadline_or_dates: 'deadline',
  cost_or_award: 'cost', eligibility_tags: 'tags', eligibility_tagts: 'tags', application_url: 'url'
};

function normalizeHeader(header) {
  const key = header.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  return HEADER_ALIASES[key] || key;
}

function parseCsv(text) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index], next = text[index + 1];
    if (character === '"' && quoted && next === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && next === '\n') index += 1; row.push(value.trim()); rows.push(row); row = []; value = ''; }
    else value += character;
  }
  if (value || row.length) { row.push(value.trim()); rows.push(row); }
  const headers = rows.shift().map(normalizeHeader);
  return rows.filter(item => item.some(Boolean)).map(item => Object.fromEntries(headers.map((header, index) => [header, item[index] || ''])));
}

async function loadResources() {
  const entries = await Promise.all(Object.entries(DATASETS).map(async ([key, dataset]) => {
    const response = await fetch(dataset.file);
    if (!response.ok) throw new Error(`Could not load ${dataset.file}`);
    const records = parseCsv(await response.text()).map(record => ({ ...record, key, label: dataset.label, pageUrl: dataset.url, tags: record.tags ? record.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [] }));
    return records;
  }));
  return entries.flat();
}