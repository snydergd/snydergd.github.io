---
title: Blog pages
---
Here are some pages talking about things as they come up with my thoughts on them.

{% assign files = site.pages | where_exp: "item", "item.date != nil" %}
{% for file in files %}
<div class="card" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">{{ file.title }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ file.date | date_to_string: "ordinal", "US" }}{% if file.subtitle %} - {{file.subtitle}}{% endif %}</h6>
        <p class="card-text">{{ file.excerpt }}</p>
        <a href="{{file.url}}" class="card-link stretched-link">Visit</a>
    </div>
</div>
{% endfor %}