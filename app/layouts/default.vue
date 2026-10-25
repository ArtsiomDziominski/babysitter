<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
    <Footer />
  </div>
</template>

