import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.html',
})
export class HelpComponent {
  faqs = [
    { q: 'How do I add a new record?', a: 'Open any module from the sidebar and click the "Add New" button at the top right of the list screen.' },
    { q: 'How do I authorize a record?', a: 'Select the record from the list, review the details, and mark it as Authorized before it is used in transactions.' },
    { q: 'How do I export data to Excel?', a: 'On any list screen, click "Export to Excel" to download the currently filtered records as an .xlsx file.' },
    { q: 'Who do I contact for support?', a: 'Reach out to your system administrator or the CRPL support desk for further assistance.' },
  ];
}
