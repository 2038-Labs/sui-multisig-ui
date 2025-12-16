import { memo } from 'react';

interface DownloadTemplateProps {}
const DownloadTemplate = memo<DownloadTemplateProps>(() => {
  return (
    <a
      className="btn btn-sm btn-warning"
      download="pub-keys-w-weight.json"
      href="json/template.json"
    >
      Download JSON template
    </a>
  );
});
DownloadTemplate.displayName = 'DownloadTemplate';
export default DownloadTemplate;
