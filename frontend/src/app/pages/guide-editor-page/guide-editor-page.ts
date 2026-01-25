import { Component } from '@angular/core';

@Component({
  selector: 'app-guide-editor-page',
  imports: [],
  templateUrl: './guide-editor-page.html',
  styleUrl: './guide-editor-page.scss',
})
export class GuideEditorPage {
  gameName: string = history.state.gameName || 'Unknown Game';
}
