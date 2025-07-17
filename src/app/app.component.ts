import { Component, OnInit, HostListener } from '@angular/core';
import { ArticleService } from './services/article.service';
import { Article } from './models/article.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterModule, ArticleListComponent, FormsModule],
  
})
export class AppComponent implements OnInit {
  articles: Article[] = [];
  page = 0;
  size = 5;
  loading = false;
  selectedCategoryName: string = '';
  searchTerm: string = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    if (this.loading) return;
    this.loading = true;
    this.articleService.getArticles(0, 100).subscribe((data) => {
      if (data && data.length > 0) {
        data.forEach(article => {
          article.description = article.content.slice(0, 120) + '...';
        });
        this.articles = data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      this.page++;
      this.loading = false;
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      this.loadArticles(); // Lazy load khi scroll gần cuối trang
    }
  }

  onCategoryChange(category: string) {
    this.selectedCategoryName = category;
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
  }
}
