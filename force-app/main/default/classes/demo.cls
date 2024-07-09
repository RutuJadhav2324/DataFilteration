<template>
    <c-modal lwc:if={showModal} title="Filters" show-on-render onmodalhidden={hide} content-padding="none" modal-container-style="max-width: 35rem;">
        <div class="slds-p-around_small">
            <template for:each={filters} for:item="filter">
                <div key={filter.id} class="msj-card slds-m-bottom_xx-small" style="overflow:hidden;">
                    <lightning-accordion allow-multiple-sections-open active-section-name={openFilterSections}>
                        <lightning-accordion-section 
                            name={filter.section} 
                            label={filter.section}>
                            <lightning-input
                                lwc:if={filter.searchable} 
                                class="js-search-input slds-m-bottom_large" 
                                label="Search"
                                variant="label-hidden"
                                type="search"
                                onchange={searchByText}
                                placeholder="Search by name..."
                                value={searchText}
                                data-section={filter.section}>
                            </lightning-input>
                            <!-- <div slot="actions" class="slds-text-body_small slds-text-color_weak slds-align_absolute-center">{selectedFiltersCount} selected</div> -->
                            <div slot="actions" class="slds-text-body_small slds-text-color_weak slds-align_absolute-center">{filter.selectedCount} selected</div>
                            <div class="msj-filter-section">
                                <ul class="slds-grid slds-gutters_direct-x-small slds-wrap">
                                    <template for:each={filter.FilterOptions} for:item="filterOption">
                                        <li lwc:if={filterOption.visible} key={filterOption.id} class="slds-col slds-size_1-of-2">
                                            <lightning-input 
                                                class="js-filter"
                                                type={filterOption.inputType}
                                                label={filterOption.label}
                                                onchange={handleFilterSelection}
                                                checked={filterOption.checked}
                                                data-section={filter.section}
                                                min={minDate} 
                                                max={maxDate}>
                                            </lightning-input>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </lightning-accordion-section>
                    </lightning-accordion>
                </div>
            </template>
        </div>
        <div class="slds-grid" slot="footer">
            <lightning-button class="slds-col slds-no-flex slds-col_bump-right" label="Clear All" variant="base" onclick={clearFilterSelection}></lightning-button>
            <lightning-button class="slds-col slds-no-flex" label="Cancel" variant="neutral" onclick={hide}></lightning-button>
            <lightning-button class="slds-m-left_x-small slds-col slds-no-flex" label="Apply" onclick={applyFilters} variant="brand"></lightning-button>
        </div>
    </c-modal>
    <c-toast></c-toast>
</template>

// <!-- <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
                           
// </div> -->