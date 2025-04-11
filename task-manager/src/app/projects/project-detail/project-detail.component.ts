import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  projectId!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Hämta projektets ID från URL-parametern
    this.projectId = this.route.snapshot.paramMap.get('id')!;
  }

}
