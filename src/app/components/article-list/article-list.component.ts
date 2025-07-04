import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  imports: [CommonModule]
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() selectedCategoryName: string = '';
  articles: Article[] = [];
  displayCount = 10;
  isLoading = false;
  loadStep = 10;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles(0, 100).subscribe((data: Article[]) => {
      if (data && data.length > 0) {
        // Xử lý description ngắn và gán url làm image nếu có
        data.forEach(article => {
          article.description = article.content.slice(0, 120) + '...';
        });
        this.articles = data;
        console.log('DATA:', data);
      }
    });
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  get canLoadMore(): boolean {
    return this.displayCount < this.filteredArticles().length;
  }

  onScroll() {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
      if (this.canLoadMore && !this.isLoading) {
        this.loadMore(true);
      }
    }
  }

  loadMore(auto = false) {
    if (this.isLoading) return;
    this.isLoading = true;
    setTimeout(() => {
      this.displayCount += this.loadStep;
      this.isLoading = false;
    }, auto ? 1200 : 500); // auto scroll thì loading lâu hơn chút
  }

  filteredArticles(): Article[] {
    if (!this.selectedCategoryName) return this.articles;
    return this.articles.filter(a => a.categoryName === this.selectedCategoryName);
  }
}
