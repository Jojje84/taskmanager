import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight!: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appHighlight) {
      this.el.nativeElement.style.backgroundColor = '#fff3cd';
      this.el.nativeElement.style.border = '1px solid #ffeeba';
    }
  }
}
